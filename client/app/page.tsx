"use client"




import { useState, useEffect } from "react"
import { Button } from '@/components/ui/button'
import { Provider, useSelector } from 'react-redux'
import { store, useAppDispatch } from './store/store'
import axiosInstance from '@/lib/axios'
import "./globals.css"
import axiosError from '@/lib/axiosError'
import type { RootState } from "./store/store"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { accessUser, logOutUser } from './features/userSlice'
import { fetchSlug, fetchUser } from './features/storySlice'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import moment from 'moment'
import { Popover } from '@radix-ui/react-popover'
import { toast } from '@/components/ui/use-toast'
import { AxiosError } from "axios"
import { PostComponet } from "./(page)/helper"
import MainHeader from "@/components/mainHeader"

// TODO error page 
// TODO theme color , font variable
// TODO search functionality
//





export function dateConvert(date: string) {
  return moment(date).format("DD MMM YYYY")
}

export default function Home() {
  const [postData, setPostData] = useState<Array<{ _id: string, slug: string, author: string, title: string, createdAt: string }>>([{ _id: "", slug: "", author: "", title: "", createdAt: "" }])
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const data = useSelector((state: RootState) => state.userReducer)
  const storyData = useSelector((state: RootState) => state.storyReducer)

  console.log("userdata ", data)
  console.log(storyData)
  // console.log(storyData)
  const dispatch = useAppDispatch()
  const router = useRouter()
  function commentHandler() {
    router.push("/comment/addComment")
  }

  async function detailPostHandler(slug: string, author: string) {
    dispatch(fetchSlug(slug))
    dispatch(fetchUser(author))
    router.push(`/post/${slug}`)
  }

  // LEARNED- git checkout -- filname for undo the changes


  async function forAllStories() {
    //const response = await dispatch(fetchAllStories())
    //console.log(response.payload)
    // console.log(response.payload)
    //setPostData(response.payload)
    try {

      const { data } = await axiosInstance.get(`/story/getAllStories?page=${page}`)
      console.log(data.query)
      if (!data) {
        throw new Error("no response found")
      } else if (!data.query) {
        throw new Error("response have no query")
      } else {
        setPostData(data.query)
        setHasMore(data.query.length == 10)
      }
    } catch (error) {
      toast({
        description: "No post found may be server error",
      })
      return axiosError(error as AxiosError)
    }

  }
  // async function likeHandler(slug) {
  //   try {
  //     const token = localStorage.getItem("token")
  //     console.log(token)
  //     // console.log(token)
  //     const headers = { "Authorization": `Bearer ${token}` }
  //
  //     const response = await axiosInstance.post(`/story/${slug}/like`, {}, { headers: headers })
  //
  //   } catch (error) {
  //     console.log("likeHandler " + error)
  //     axiosError(error as AxiosError)
  //   }
  // }
  //
  const scrollHandler = (event) => {
    const { target } = event
    if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore) {
      console.log("scroll")
      setPage(page + 1)
    }
    if (target.scrollTop === 0 && page > 1) { // Check if scrolled to top and not on first page
      setPage(page - 1);
    }
  }



  useEffect(() => {
    try {
      forAllStories()

    } catch (error) {
      console.log(error)
    }
  }, [page])
  // console.log('postdata ' + postData)
  return (
    <>
      <Provider store={store}>
        <div className='max-h-screen overflow-hidden' >

          <div>
            <MainHeader />
          </div>
          <main >
            <div className='bg-light-foreground' >
              <div className='grid grid-cols-12 w-8/12 mx-auto pt-6 gap-1  min-h-screen'>
                <div className=' col-start-1 col-end-3 grid justify-self-start'>

                  <div className='grid grid-rows-12 justify-self-start h-96'>
                    <p className='hover:bg-indigo-100 cursor-pointer pl-2 w-[200px]'>Home</p>
                    <p className='hover:bg-indigo-100 cursor-pointer pl-2 mt-1'>About</p>
                    <p className='hover:bg-indigo-100 cursor-pointer pl-2 mt-1' onClick={() => {


                    }}>Liked</p>
                  </div>
                </div>


                <div className=' col-start-3 col-end-10 text-white overflow-scroll min-h-screen max-h-screen ' onScroll={scrollHandler}>
                  {postData.map(({ _id, author, slug, title, createdAt }) => (

                    <PostComponet _id={_id} key={_id} author={author} createdAt={createdAt} title={title} detailPostHandler={detailPostHandler} slug={slug} />

                  ))}


                </div>



                <div className=' col-start-10 col-end-13'>
                  <Card className='rounded-b-none p-4'>
                    <h3 className='text-xl font-medium'>Other posts</h3>

                  </Card>

                  <Card className='rounded-none p-3'>
                    <p>so many posts</p>

                  </Card>
                </div>

              </div>

            </div>
          </main >
        </div >
      </Provider >

    </>
  )
}


