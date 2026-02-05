"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowRight, Link as LinkIcon, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'

function Interview() {
  const { interviewId } = useParams();
  const [email, setEmail] = useState('');
  const interviewLink = useMemo(() => `/interview/${interviewId}/start`, [interviewId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${interviewLink}`);
      toast.success('Link copiado al portapapeles');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo copiar el link');
    }
  };

  const handleSendEmail = () => {
    if (!email.trim()) {
      toast.error('Ingresa un correo válido');
      return;
    }

    const subject = encodeURIComponent('Invitación a entrevista');
    const body = encodeURIComponent(
      `Hola, aquí tienes el link para la entrevista:\n\n${window.location.origin}${interviewLink}`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className='flex flex-col items-center justify-center mt-14'>
      <div className='max-w-3xl'>
        <Image src={'/interview.jpg'} alt='interview'
          width={400}
          height={200}
          className='w-full h-75 object-cover'
        />
        <div className='p-6 flex flex-col items-center space-y-5'>
          <h2 className='font-bold text-3xl text-center'>Ready to Start Interview?</h2>
          <p className='text-gray-500 text-center'>
            The interview will last 30 minutes. Are you ready to begin?
          </p>
          <Link href={interviewLink}>
            <Button> Start Interview <ArrowRight /> </Button>
          </Link>
          <hr />
          <div className='p-6 bg-gray-50 rounded-2xl'>
            <h2 className='font-semibold text-2xl' >Want to send interview link to someone?
            </h2>
            <div className='flex items-center justify-center mt-2 text-gray-500'>
              <button
                type='button'
                onClick={handleCopyLink}
                className='inline-flex items-center gap-2 text-sm hover:text-gray-800'
              >
                <LinkIcon className='h-4 w-4' />
                Copiar link
              </button>
            </div>
            <div className='flex gap-5 w-full items-center max-w-xl mt-2'>
              <Input
                placeholder='Enter email address'
                className='w-full'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type='email'
              />
              <Button type='button' onClick={handleSendEmail}><Send /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview
