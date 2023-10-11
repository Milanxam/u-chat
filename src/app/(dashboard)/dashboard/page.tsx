import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    })
  )

  return (
    <div className='container py-12 text-black'>
      <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here yet, <span className='text-indigo-600'><Link href="/dashboard/add">add a friend</Link></span>!</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md group hover:bg-zinc-100 mb-4 shadow-medium'>
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-zinc-400 group-hover:translate-x-1 ease-in-out transition-transform duration-150' />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative sm:flex'>
              <div className='mb-4 flex-shrink-0 self-center sm:mb-0 sm:mr-4'>
                <div className='relative h-10 w-10'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div className='text-sm'>
                <h4 className='text-lg font-semibold'>{friend.name}</h4>
                <p className='max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You:  '
                      : ''}
                    <span className='tetx-sm text-gray-700'>
                      {friend.lastMessage.text}
                    </span>
                  </span>
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default page