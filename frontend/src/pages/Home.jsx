import React from 'react'
import { useAuthStore } from "../store/useAuthStore.js";

function Home() {

  const { authUser } = useAuthStore();
  console.log(authUser);

  return (
    <>

    </>
  )
}

export default Home