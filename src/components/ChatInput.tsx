"use client"

import React, { FC, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import { SendHorizontal, SmilePlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    chatPartner: User;
    chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const sendMessage = async () => {
        if (!input) return;
        setIsLoading(true);

        try {
            await axios.post('/api/message/send', { text: input, chatId });
            setInput('');
            textareaRef.current?.focus();
        } catch {
            toast.error('Oops, Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        setInput((prevInput) => prevInput + emoji.native);
    };

    const togglePicker = () => {
        setIsPickerVisible(!isPickerVisible);
    };

    return (
        <div className='border-t border-gray-200 px-4 pt-2 mb-2 sm:mb-0 pb-2'>
            <div className="static">
                <div className='absolute top-[19rem] z-10'>
                    <div className=''>
                        {isPickerVisible && (
                        <Picker previewPosition='bottom' onClickOutside={togglePicker} theme='light' data={data} onEmojiSelect={handleEmojiSelect} />
                        )}
                    </div>
                </div>
            </div>
            <div className='relative flex-1 overflow-hidden rounded-xl ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-400'>
                <TextareaAutosize
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Send a message to ${chatPartner.name}`}
                    className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
                />

                <div
                    onClick={() => textareaRef.current?.focus()}
                    className='p-2'
                    aria-hidden='true'
                >
                    <div className='py-px'>
                        <div className='' />
                    </div>
                </div>
                <div className='flex-shrink-0'>
                    <button onClick={togglePicker}>
                        <SmilePlus className='h-10 w-10 text-gray-400 p-2' />
                    </button>
                </div>
                <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                    <div className='flex-shrink-0'>
                        <Button isLoading={isLoading} onClick={sendMessage} type='submit' className='bg-indigo-600 group'>
                            <SendHorizontal className={cn('', {'hidden': isLoading})}/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
