import AddFriendButton from '@/components/AddFriendButton'
import { FC } from 'react'

const page: FC = ({}) => {
  return <main className='pt-8 bg-white p-12'>
    <h1 className='font-bold text-4xl mb-8 text-zinc-900'>Add a friend</h1>
    <AddFriendButton />
  </main>
}

export default page