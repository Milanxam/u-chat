import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { fetchRedis } from '@/helpers/redis'
import { Message } from 'postcss'
import { messageArrayValidator } from '@/lib/validation/message'
import Image from 'next/image'
import Messages from '@/components/Messages'
import ChatInput from '@/components/ChatInput'

interface PageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages

  } catch (error) {
    notFound()
  }
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const { user } = session

  const [userId1, userId2] = chatId.split('--')

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1

  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const initialMessages = await getChatMessages(chatId)

  // max-h-[calc(100vh-6rem for first div og styling

  return (
    <div className='flex-1 justify-between flex flex-col bg-white h-full max-h-[calc(100vh-0.02rem)] sm:mb-1'> 
      <div className='flex sm:items-center justify-between py-4 pl-2 pt-5 border-b border-20 border-gray-300 z-10 sm:py-1'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId} 
        chatPartner={chatPartner}
        sessionImg={session.user.image} 
        sessionId={session.user.id} 
        initialMessages={initialMessages}/>
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}
export default page