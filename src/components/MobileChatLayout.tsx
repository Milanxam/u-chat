"use client"

import { FC, useEffect } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Button, { ButtonVariants } from './ui/Button'
import { Icons } from './Icons'
import Image from 'next/image'
import FriendRequestSidebarOption from './FriendRequestSidebarOption'
import SidebarChatList from './SidebarChatList'
import { Session } from 'next-auth'
import SignOutButton from './SignOutButton'
import { SideBarOption } from '@/types/typings'
import { usePathname } from 'next/navigation'
import { ChatsCircle } from '@phosphor-icons/react'


interface MobileChatLayoutProps {
    friends: User[]
    session: Session
    sidebarOptions: SideBarOption[]
    unseenRequestCount: number
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({friends, session, sidebarOptions, unseenRequestCount}) => {
    const [open, setOpen] = useState<boolean>(false)

    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

  return (
    <div className='fixed text-black bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 py-1 px-4'>
      <div className='w-full flex justify-between items-center'>
        <div>
          <Link
            href='/dashboard'
            className='color fill-current text-gray-600 hover:text-indigo-600'>
              <ChatsCircle size={35} weight='duotone'/>
          </Link>
        </div>
        <Button onClick={() => setOpen(true)} variant='ghost' className='gap-4'>
          <Menu className='h-6 w-6' />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <div className='fixed inset-0' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'>
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl w-80'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Link href='/dashboard' className='flex h-16 shrink-0 item-center my-10 -mt-5 -ml-1 gap-3'>
                              <span className='mt-5 h-10 w-auto fill-current text-indigo-500'>
                              <Icons.Logo className='h-10 w-auto text-indigo-600' />
                              </span>
                          </Link>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                              onClick={() => setOpen(false)}>
                              <span className='sr-only'>Close panel</span>
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {/* Content */}

                        {friends.length > 0 ? (
                          <div className='text-xs font-semibold leading-6 text-gray-400 mb-2'>
                            Your chats
                          </div>
                        ) : null}

                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-3'>
                            <li>
                              <SidebarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>
                            <div className='text-xs  -mb-2 font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>
                            <li>
                              <ul role='list' className='-mx-2 space-y-2 bg-gray-50 rounded-xl p-3'>
                                  {sidebarOptions.map((option) => {
                                      const Icon = Icons[option.Icon]
                                      return(
                                          <li key={option.id}>
                                              <Link 
                                                  href={option.href}
                                                  className='text-gray-700 bg-gray-50 hover:bg-white hover:shadow-sm hover:text-indigo-600 group flex gap-3 rounded-xl mb-[1em] p-3 text-sm leading-6 font-semibold'>
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
                            </li>

                          <li className='-mx-6 mt-80 flex items-center mb-5'>
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
                                    <SignOutButton className='h-full aspect-square rounded-2xl mr-3 ml-3  ' />
                                </div>  
                            </li>
                          </ul>
                        </nav>

                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default MobileChatLayout
