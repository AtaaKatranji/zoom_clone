'use client'

import Image from 'next/image'
import { title } from 'process'
import React, { use } from 'react'
import { Button } from './button'
import { useToast } from './use-toast'
import { cn } from '@/lib/utils'
import { avatarImages } from '@/Constant'

interface MeetingCardProps {
    icon: string,
    title: string,
    date: string,
    isPreviousMeeting?: boolean,
    buttonText?: string,
    buttonIcon1?: string,
    link: string,
    handleClick: ()=>void;

}
const MeetingCard = ({
    icon,
    title,
    date,
    isPreviousMeeting,
    buttonIcon1,
    buttonText,
    handleClick,
    link,
}: MeetingCardProps ) => {
    const { toast } = useToast();
  return (
    <section className='flex flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 w-full min-h-[258px] xl:max-w-[568px] '>
        <article className='flex flex-col gap-5'>
            <Image 
                src={icon}
                alt='upcoming'
                width={28}
                height={28}/>
            <div className='flex justify-between'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>{title}</h1>
                    <p className='text-base font-normal'>{date}</p>           
                </div>
            </div>
        </article>
        <article className={cn('flex justify-center relative', {})}>
            <div className='relative flex w-full max-sm:hidden'>
                {avatarImages.map((img, index)=> (
                    <Image 
                        key={index}
                        src={img}
                        alt="attendees"
                        width={40}
                        height={40}
                        className={cn("rounded-full", {absolute : index > 0})}
                        style={{top : 0, left: index*28 }}/>
                        
                ))}
                <div className=' flex-center absolute left-[13px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4'>
                    +5
                </div>
            </div>
            {!isPreviousMeeting && (
                <div className='flex gap-2'>
                    <Button 
                        onClick={handleClick}
                        className='bg-blue-1 text-white rounded px-6 '>
                            {
                                buttonIcon1 && (
                                    <Image 
                                        src={buttonIcon1}
                                        alt='feature'
                                        width={20}
                                        height={20}/>
                                        
                                                )
                            }
                            &nbsp; {buttonText}
                        </Button>
                    <Button className='bg-dark-4 text-white px-6'
                        onClick={()=>{
                            navigator.clipboard.writeText(link);
                            toast({title: "Link Copied"})
                        }}>
                    <Image 
                        src="/icons/copy.svg"
                        alt='feature'
                        width={20}
                        height={20}/>
                        &nbsp; Copy Invition
                        </Button>
                </div>
            )}
        </article>
    </section>
  )
}

export default MeetingCard