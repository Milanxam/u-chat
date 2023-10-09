import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link';
import { Icon, Icons } from '@/components/Icons'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton';
import FriendRequestSidebarOption from '@/components/FriendRequestSidebarOption';
import { fetchRedis } from '@/helpers/redis';
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import SidebarChatList from '@/components/SidebarChatList';
import MobileChatLayout from '@/components/MobileChatLayout';
import { SideBarOption } from '@/types/typings';

interface LayoutProps {
    children: ReactNode
}

const sideBarOptions: SideBarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)
  console.log('friends', friends)

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length

    return (
        <div className='w-full flex h-screen bg-white'>
            <div className='md:hidden'>
                <MobileChatLayout 
                    friends={friends} 
                    session={session} 
                    sidebarOptions={sideBarOptions} 
                    unseenRequestCount={unseenRequestCount} 
                />
            </div>

            <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-300 bg-gray-50 px-6'>
                <Link href='/dashboard' className='flex h-16 shrink-0 item-center mb-5 gap-3'>
                    <span className='mt-5 h-10 w-auto fill-current text-indigo-500'>
                    <Icons.Logo className='h-10 w-auto text-indigo-600' />
                    </span>
                </Link>
                
                {friends.length > 0  ? (<div className='text-xs font-semibold leading-6 text-gray-400'>
                    Your chats
                </div>) : null}

                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7 text-gray-900'>
                        <li>
                            <SidebarChatList sessionId={session.user.id} friends={friends}/>
                        </li>
                        <div className='text-xs font-semibold leading-6 text-gray-400'>
                            Overview
                        </div>
                        <ul role='list' className='-mx-2 mt-2 space-y-'>
                            {sideBarOptions.map((option) => {
                                const Icon = Icons[option.Icon]
                                return(
                                    <li key={option.id}>
                                        <Link 
                                            href={option.href}
                                            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-3 text-sm leading-6 font-semibold'>
                                            <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                                <Icon className='h-4 w-4' />
                                            </span>
                                            <span className='tuncate'>{option.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                            <li>
                                <FriendRequestSidebarOption 
                                    sessionId={session.user.id} 
                                    initialUnseenRequestCount={unseenRequestCount}
                                />
                            </li>
                        </ul>

                        <li className='-mx-6 mt-auto flex items-center mb-5'>
                            <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image || ''}
                                        alt='Your profile picture'
                                    />
                                </div>
                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                    <span aria-hidden='true'>{session.user.name}</span>
                                    <span className='text-xs text-zinc-400' aria-hidden='true'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>  
                            <SignOutButton className='h-full aspect-square rounded-2xl mr-3' />
                        </li>
                    </ul>
                </nav>
            </div>
            <aside className='max-h-screen container w-full py-12 md:py-8'>{children}</aside>
    </div>
    )
}

export default Layout