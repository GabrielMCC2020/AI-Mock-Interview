import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest) {
  const {questions} = await req.json();
  // const result = await axios.get('https://openapi.akool.com/api/open/v4/knowledge/list',{
  //   headers:{
  //     Authorization: `Bearer ${process.env.AKCOOL_API_TOKEN}`
  //   }
  // });
  // console.log(result.data)  
  // const isExist=result.data.data.find((item:any)=>item.name == 'Interview Agent Prod');
  
  // if(!isExist){
      // Create knowledge base if not exist
    const resp = await axios.post('https://openapi.akool.com/api/open/v4/knowledge/create',{
      name: 'Interview Agent Prod'+ Date.now(), 
      prologue: 'Tell me about Yourself',
      prompt:`You are a friendly job interviewer.
      Ask the user one interview question at a time.
      Wait for their spoken response before asking the next question.
      Start with "Tell me about yourself."
      Then ask following question one by one.
      Speak in a profesional and encouraging tone.
      questions:
      ${JSON.stringify(questions)}
      `},
      {
      headers:{
        Authorization: `Bearer ${process.env.AKCOOL_API_TOKEN}`
      }   
    },
  );
    console.log(resp.data);
    return NextResponse.json(resp.data);
  // }
  // return NextResponse.json(result.data);
}