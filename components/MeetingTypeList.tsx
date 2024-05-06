"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"

import { Textarea } from "@/components/ui/textarea"

import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'




const MeetingTypeList = () => {
   
  

  const router = useRouter();
  const [meetingState, setmeetingState] = useState <'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined >()
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dataTime : new Date(),
    description : '',
    link : '',
  } )
  const [callDetails, setcallDetails] = useState<Call>()
  const { toast } = useToast()
  const createMeeting = async () => {
    if(!client || !user) return;

    try {
      // if(!values.dataTime){
      //   toast({title: "Plase select a date and time" })
      // };
      const id = crypto.randomUUID();
      const call = client.call('default' , id);
      if(!call) throw new Error("Failed to create call");
      const startAt = values.dataTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting' ;
      await call.getOrCreate({
        data:{
          starts_at : startAt,
          custom : {
            description
        }}
      })

      setcallDetails(call)
      if(!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({title: "Meeting Created" })
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed to create meeting",
        
      })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  
  return (
    <section className='grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard 
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="create an instant meeting"
        handleClick={()=> setmeetingState('isInstantMeeting')}
        className="bg-orange-1"/>
      <HomeCard 
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="plan your meeting"
        handleClick={()=> setmeetingState('isScheduleMeeting')}
        className="bg-blue-1"/>
      <HomeCard 
        img="/icons/recordings.svg"
        title="View Recordings"
        description="check out your recordings"
        handleClick={()=> router.push('/recordings')}
        className="bg-purple-1"/>
      <HomeCard 
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invition link"
        handleClick={()=> router.push("/recordings")}
        className="bg-yellow-1"/>
      
      {!callDetails ?
        (
          <MeetingModal 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setmeetingState(undefined)}
            title="Create Meeting"
            handleClick={createMeeting}>
              <div className="flex flex-col gap-2.5">
                <label  className="text-basse text-normal leading-[22px] text-sky-2">Add
                a description</label>
                <Textarea className='border border-white bg-dark-1
                 focus-visible:ring-0 focus-visible:ring-offset-0'
                 onChange={(e)=> {
                  setValues({...values, description: e.target.value})
                 }}/>

              </div>
              <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dataTime}
              onChange={(date) => setValues({ ...values, dataTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
            </MeetingModal>
        ):(
          <MeetingModal 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setmeetingState(undefined)}
            title="Meeting Created"
            className="text-center"
            handleClick={()=> {
              navigator.clipboard.writeText(meetingLink)
              toast({title:'Link Copied'})
            }}
            image='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'
            buttonText = "Copy Meeting Link"
            />
          )}
      <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText = "Start Meeting"
        handleClick={createMeeting}/>

      <MeetingModal 
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText = "Join Meeting"
        handleClick={()=> router.push(values.link)}>
          <Input 
            placeholder='Meeting Link'
            className='border-none bg-dark-3
            focus-visible:ring-0
            focus-visible:ring-offset-0 '
            onChange={(e)=> setValues({...values, link: e.target.value})} />

        </MeetingModal>
    </section>

  )
}

export default MeetingTypeList