import { AuthUserState } from "@/store/auth.store"

export default function Home(){
  const user = AuthUserState((state) =>state.user)
  return(
    <>
      <h1>welcome  {user?.fullName}</h1>
    </>
  )
}