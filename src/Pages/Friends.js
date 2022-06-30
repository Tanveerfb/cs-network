import React from 'react'
import { Container, Form, Button } from 'react-bootstrap'

export default function Friends() {
  return (
    <Container>
      <Container className='my-2'>
        <Form.Label>Search</Form.Label>
        <Form.Control type='text'/>
        <Button>Search</Button>
      </Container>
    </Container>
  )
}
