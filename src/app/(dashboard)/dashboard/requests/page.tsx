import AddFriendButton from '@/components/AddFriendButton'
import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const page = async () => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()

    // ids of people who sent the friend requestS
    const incomingSenderIds = (await fetchRedis(
        'smembers', 
        `user:${session.user.id}:incoming_friend_requests`,
    )) as string[]

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = await fetchRedis('get', `user:${senderId}`) as string
            const senderParsed = JSON.parse(sender) as User
            return {
                senderId,
                senderEmail: senderParsed.email,
            }
        })
    )

    

    return (
        <main className='pt-8 bg-white p-12'>
            <h1 className='font-bold text-4xl mb-8 text-zinc-900'>Friend requests</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
            </div>
        </main>
    )
}

export default page