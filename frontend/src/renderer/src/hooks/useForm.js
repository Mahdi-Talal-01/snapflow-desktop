import React, { useState } from 'react'

const useForm = (initialValue) => {
  const [form, setForm] = useState(initialValue)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({
      ...form,
      [name]: value
    })
  }

  return [form, handleChange]
}

export default useForm
