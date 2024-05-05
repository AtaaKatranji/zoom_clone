// @ts-nocheck
"use client"

import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MeetingCard from './ui/MeetingCard';
import Loader from './Loader';


const CallList = ({ type } : { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const  { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const getCalls = () => {
    switch (type) {
        case 'ended':
            return endedCalls;
        case 'recordings':
            return recordings;
        case 'upcoming':
            return upcomingCalls;
        default:
            return [];
    }
  }
  const getNoCallsMessage = () => {
    switch (type) {
        case 'ended':
            return 'No Previous Calls';
        case 'recordings':
             return 'No Recordings';
        case 'upcoming':
             return 'No upcoming Calls';
        default:
            return [];
    }
  }

  useEffect(()=>{
    try {
        const fetchRecordings = async () => {
            const callDate = await Promise.all(
                callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
            );
            const recordings = callDate
            .filter(call => call.recordings.length > 0)
            .flatMap(call => call.recordings)
    
            setRecordings(recordings);
        
    }
            if(type === 'recordings') fetchRecordings();
        } catch (error) {
        toast({title: 'Try again later'})
    }
    
    
  },[type, callRecordings])

  const calls = getCalls();
  console.log(calls)
  const noCallsMessage = getNoCallsMessage();

  if(isLoading) return <Loader />
    return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {calls && calls.length > 0 ? (
            calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call).id}
                    icon={
                        type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recordings.svg'
                    }
                    title={meeting.state?.custom?.description?.substring(0,25) || meeting?.filename?.substring(0, 20)|| 'Personal Meeting'}
                    date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                    isPreviousMeeting = {type === 'ended'}
                    buttonIcon1= { type == 'recordings' ? '/icons/play.svg' : undefined }
                    buttonText={ type === 'recordings' ? 'Play' : 'Start '}
                    link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`} 
                    handleClick= {type === 'recording ' ? ()=> router.push(`${(meeting as Call).url}`) : ()=> router.push(`/meeting/${meeting.id}`) }
                    />
            ))
        ) : (
            <h1>{noCallsMessage}</h1>
        )}
    </div>
  )
}


export default CallList