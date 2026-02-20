import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Sort direction for a column */
export type SortDirection = "asc" | "desc" | null;

/**
 * Descriptor for a single table column.
 *
 * @template TRow  The shape of a single data row.
 */
export interface TableColumn<TRow> {
    /** Unique key — must match a key of TRow or be a custom identifier for render-only columns */
    key: string;
    /** Column header label */
    header: string;
    /** Whether this column is sortable (default: false) */
    sortable?: boolean;
    /** Extra classes applied to the <th> element */
    headerClassName?: string;
    /** Extra classes applied to each <td> element for this column */
    cellClassName?: string;
    /**
     * Custom cell renderer.
     * If omitted the value at `row[key]` is rendered as a string.
     */
    render?: (row: TRow, index: number) => React.ReactNode;
    /**
     * Value extractor used for client-side sorting.
     * Falls back to `(row) => (row as Record<string, unknown>)[key]`.
     */
    sortValue?: (row: TRow) => string | number | boolean | null | undefined;
}

/**
 * Props for CustomTable.
 *
 * @template TRow  The shape of a single data row.
 */
export interface CustomTableProps<TRow> {
    /** Column definitions — drives the whole table */
    columns: TableColumn<TRow>[];
    /** The data rows to display */
    data: TRow[];
    /**
     * Key extractor for React list rendering.
     * Defaults to using the row index if omitted.
     */
    rowKey?: (row: TRow, index: number) => string | number;
    /** Called when a row is clicked */
    onRowClick?: (row: TRow, index: number) => void;
    /** Show a loading skeleton instead of data */
    isLoading?: boolean;
    /** Number of skeleton rows shown while loading (default: 5) */
    skeletonRows?: number;
    /** Content shown when data is empty and not loading */
    emptyState?: React.ReactNode;
    /** Enable client-side pagination */
    paginate?: boolean;
    /** Rows per page when pagination is enabled (default: 10) */
    pageSize?: number;
    /** Wrapper className for the outermost container */
    className?: string;
    /** className forwarded to the inner <Table> */
    tableClassName?: string;
    /** Extra content rendered above the table (search bar, filters, etc.) */
    toolbar?: React.ReactNode;
    /** Extra content rendered below the table (custom pagination, totals, etc.) */
    footer?: React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultSortValue<TRow>(row: TRow, key: string): unknown {
    return (row as Record<string, unknown>)[key];
}

function compareValues(a: unknown, b: unknown, dir: "asc" | "desc"): number {
    const mult = dir === "asc" ? 1 : -1;
    if (a == null && b == null) return 0;
    if (a == null) return 1 * mult;
    if (b == null) return -1 * mult;
    if (typeof a === "number" && typeof b === "number") return (a - b) * mult;
    return String(a).localeCompare(String(b)) * mult;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CustomTable – a single reusable table engine for the entire app.
 *
 * @example
 * ```tsx
 * <CustomTable
 *   columns={[
 *     { key: "name",  header: "Name",   sortable: true },
 *     { key: "email", header: "Email",  sortable: true },
 *     {
 *       key: "status",
 *       header: "Status",
 *       render: (row) => <Badge>{row.status}</Badge>,
 *     },
 *     {
 *       key: "actions",
 *       header: "",
 *       render: (row) => <Button onClick={() => edit(row)}>Edit</Button>,
 *     },
 *   ]}
 *   data={users}
 *   rowKey={(row) => row.id}
 *   onRowClick={(row) => navigate(`/users/${row.id}`)}
 *   paginate
 *   pageSize={10}
 *   isLoading={isLoading}
 *   emptyState={<p>No users found.</p>}
 *   toolbar={<SearchInput />}
 * />
 * ```
 */
function CustomTable<TRow>({
    columns,
    data,
    rowKey,
    onRowClick,
    isLoading = false,
    skeletonRows = 5,
    emptyState,
    paginate = false,
    pageSize = 10,
    className,
    tableClassName,
    toolbar,
    footer,
}: CustomTableProps<TRow>) {
    // ── Sort state ────────────────────────────────────────────────────────────
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);

    // ── Pagination state ──────────────────────────────────────────────────────
    const [page, setPage] = useState(1);

    // ── Derived: sorted + paginated data ─────────────────────────────────────
    const sortedData = useMemo(() => {
        if (!sortKey || !sortDir) return data;
        const col = columns.find((c) => c.key === sortKey);
        return [...data].sort((a, b) => {
            const av = col?.sortValue ? col.sortValue(a) : defaultSortValue(a, sortKey);
            const bv = col?.sortValue ? col.sortValue(b) : defaultSortValue(b, sortKey);
            return compareValues(av, bv, sortDir);
        });
    }, [data, sortKey, sortDir, columns]);

    const totalPages = paginate ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;

    const visibleData = useMemo(() => {
        if (!paginate) return sortedData;
        const start = (page - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, paginate, page, pageSize]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    function handleSort(colKey: string) {
        if (sortKey !== colKey) {
            setSortKey(colKey);
            setSortDir("asc");
        } else if (sortDir === "asc") {
            setSortDir("desc");
        } else {
            setSortKey(null);
            setSortDir(null);
        }
        // Always reset to first page when sort changes
        setPage(1);
    }

    function handlePageChange(next: number) {
        setPage(Math.min(Math.max(1, next), totalPages));
    }

    // ── Sort icon helper ──────────────────────────────────────────────────────
    function SortIcon({ colKey }: { colKey: string }) {
        if (sortKey !== colKey) return <ChevronsUpDown className="ml-1.5 inline h-3.5 w-3.5 opacity-40" />;
        if (sortDir === "asc") return <ChevronUp className="ml-1.5 inline h-3.5 w-3.5" />;
        return <ChevronDown className="ml-1.5 inline h-3.5 w-3.5" />;
    }

    // ── Skeleton ──────────────────────────────────────────────────────────────
    function SkeletonRows() {
        return (
            <>
                {Array.from({ length: skeletonRows }).map((_, ri) => (
                    <TableRow key={`skeleton-${ri}`} className="hover:bg-transparent">
                        {columns.map((col) => (
                            <TableCell key={col.key}>
                                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </>
        );
    }

    // ── Empty state ───────────────────────────────────────────────────────────
    const defaultEmpty = (
        <p className="text-sm text-muted-foreground">No data available.</p>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* Optional toolbar slot */}
            {toolbar && <div>{toolbar}</div>}

            {/* Table */}
            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table className={tableClassName}>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={cn(
                                        "text-slate-400 font-medium select-none whitespace-nowrap",
                                        col.sortable && "cursor-pointer hover:text-white transition-colors",
                                        col.headerClassName
                                    )}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                >
                                    {col.header}
                                    {col.sortable && <SortIcon colKey={col.key} />}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <SkeletonRows />
                        ) : visibleData.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={columns.length}
                                    className="py-16 text-center"
                                >
                                    {emptyState ?? defaultEmpty}
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleData.map((row, idx) => (
                                <TableRow
                                    key={rowKey ? rowKey(row, idx) : idx}
                                    onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
                                    className={cn(
                                        "border-white/10 transition-colors",
                                        onRowClick && "cursor-pointer hover:bg-white/5"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={cn("text-slate-200", col.cellClassName)}
                                        >
                                            {col.render
                                                ? col.render(row, idx)
                                                : String(
                                                    (row as Record<string, unknown>)[col.key] ?? ""
                                                )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {paginate && !isLoading && sortedData.length > 0 && (
                <div className="flex items-center justify-between px-1 text-sm text-slate-400">
                    <span>
                        {sortedData.length === 0
                            ? "0 rows"
                            : `${(page - 1) * pageSize + 1}–${Math.min(
                                page * pageSize,
                                sortedData.length
                            )} of ${sortedData.length}`}
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-white disabled:opacity-30"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="min-w-[5rem] text-center">
                            Page {page} of {totalPages}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-white disabled:opacity-30"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Optional footer slot */}
            {footer && <div>{footer}</div>}
        </div>
    );
}

export { CustomTable };
export default CustomTable;
