"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from "react"
import Profile from './profile/page'
import { Button } from '@/components/ui/button'
import { Provider } from 'react-redux'
import { Model, createServer } from "miragejs"
import { store } from './store/store'
import axiosInstance from '@/lib/axios'
import axiosError from '@/lib/axiosError'
import { within } from '@testing-library/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"




export default function Home() {
  const [postData, setPostData] = useState([])
  const [user, setUser] = useState(null)
  async function forPrivateData() {
    try {

      const token = localStorage.getItem("token")

      console.log(token)
      const { data } = await axiosInstance.get("/auth/private", { headers: { "Authorization": `Bearer ${token}` } })
      console.log(data?.user?.username)
      setUser(data?.user?.username)
    } catch (error) {
      axiosError(error)
    }
  }
  async function forAllStories() {
    try {
      const { data } = await axiosInstance.get("/story/getAllStories")
      console.log(data.query)
      setPostData(data.query)
    } catch (error) {
      axiosError(error)
    }
  }
  async function likeHandler(slug) {
    try {
      const token = localStorage.getItem("token")
      console.log(token)
      const headers = { "Authorization": `Bearer ${token}` }

      const response = await axiosInstance.post(`/story/${slug}/like`, {}, { headers: headers })
      console.log(response)

    } catch (error) {
      axiosError(error)
    }
  }

  useEffect(() => {
    try {
      forPrivateData()

    }
    catch (e) {
      console.error(e)
    }
  }, [forPrivateData])
  useEffect(() => {
    try {
      forAllStories()

    } catch (error) {
      console.log(error)
    }
  }, [])
  console.log('postdata ' + postData)
  return (
    <>
      <Provider store={store}>
        <main >
          <div className='grid grid-cols-2  w-full place-content-between'>
            <div className=''>
              <Button>Blog</Button>
            </div>
            <div className='place-self-end '>
              <Button><Link href="/profile">profile</Link>
              </Button>
              <Button className='mx-2'>
                <Link href={`/post`}>Create Post</Link>
              </Button>
              <Button className='mx-2'>
                <Link href={`/users`}>total users</Link>
              </Button>
              <Button className='mx-2'>
                <Link href={`/profile/register`}>register</Link>
              </Button>
              <Button className='mx-2'>
                <Link href={`/profile/login`}>login</Link>
              </Button>

            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <div className='col-start-2 align-middle'>
              {user && <div>{user}</div>}
            </div>
          </div>
          <div className='mt-4'>
            {postData.map((post) => (
              <Card key={post._id}>
                <CardHeader>
                  <CardTitle>{post.title} </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <CardFooter>
                  <div className='grid  grid-cols-3  w-full'>
                    <div>
                      <Button onClick={() => { likeHandler(post.slug) }}>{post.likeCount} likes</Button>
                    </div>
                    <p>createdAt: {post.createdAt}</p>
                    <p className='place-self-end'>comment</p>


                  </div>
                </CardFooter>
              </Card>


            ))}
          </div>

        </main >
      </Provider>
    </>
  )
}
