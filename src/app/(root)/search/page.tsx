import UserCard from "@/components/cards/UserCard"
import { fetchUser, fetchUsers } from "@/lib/actions/user-actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"


async function Page() {

    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')

    const result = await fetchUsers({
      userId:user.id,
      searchString:"",
      pageNumber:1,
      pageSize:25
    })

  return (
    <section className="">
        <h1 className="head-text mb-10">
            Search
        </h1>


      <div className="mt-14 flex flex-col gap-9">
        {
          result.users.length ===0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              {
                result.users.map((person)=>(
                  <UserCard name={person.name} username={person.name} image={person.image} personType="User" id={person.id} key={person.id} />
                ))
              }
            </>
          )
        }
      </div>        
    </section>
  )
}

export default Page