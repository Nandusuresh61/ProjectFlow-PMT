import type { SignUpPayload } from "@/types/auth.types";
import { API } from "../api";

export const authservice = {
  register: (payload: SignUpPayload) =>
    API.post("/register", payload),
};
