import React from 'react'
import {Link} from 'react-router-dom'
import { Table, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
const UserListScreen = () => {

  const {data:users, isLoading, error, refetch}= useGetUsersQuery();

  const [deleteUser, {isLoading:loadingDelete}]=useDeleteUserMutation();

  const deleteHandler =async(id) =>{
    if(window.confirm('Are you sure you want to delete this user')){
        try{
            await deleteUser(id);
            refetch();
            toast.success('User deleted successfully')
        }catch(error){
            toast.error(error?.data?.message || error.message)
        }
    }
  }

  return (
    <>
      <h1>Users</h1>
      {loadingDelete && <Loader/>}
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>

          </thead>
          <tbody>
            {users.map((user)=>(
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`email to: ${user.email}`}>{user.email}</a></td>
                <td>{user.isAdmin ? 
                (
                  <FaCheck style={{color:"green"}}></FaCheck>
                ):(
                    <FaCheck style={{color:"red"}}></FaCheck>
                )}
                </td>
                <td>
                     <Button
                        as={Link}
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: '10px' }}
                        variant='light'
                        className='btn-sm'
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    
    </>
  )
}

export default UserListScreen
