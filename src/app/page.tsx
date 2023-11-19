"use client"

import { User } from '@prisma/client';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({
    Id: 0,
    Login: '',
    FirstName: '',
    LastName: '',
    FullName: '',
    DisplayName: '',
    Email: '',
    Password: '',
    RegDate: new Date(),
    UpdatedDate: new Date(),
  });

  const GetUsers = async () => {
    const res = await axios.get('/api/user')
      .catch((error) => {
        console.log('catch: ', error.message);
      });

    if (res && res.data) {
      setUsers(res.data);
      console.log('GetUsers->res.data: ', res.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  const addUser = async (e: SyntheticEvent) => {
    e.preventDefault();

    const resp = await axios.post('/api/user', {
      Login: user.Login,
      Email: user.Email,
      Password: user.Password,
    });

    if (resp && resp.data) {
      console.log('AddUser->resp.data: ', resp.data);
      GetUsers();
    }

    ResetUser()
  };

  const UpdateUser = async (e: SyntheticEvent) => {
    e.preventDefault();

    const resp = await axios.put('/api/user/', {
      Id: user.Id,
      Login: user.Login,
      Email: user.Email,
      Password: user.Password,
    });

    if (resp && resp.data) {
      console.log('UpdateUser->resp.data: ', resp.data);
      GetUsers();
    }

    ResetUser()
  };

  const ResetUser = () => {
    setUser(prevState => ({ ...prevState, Id: 0, Login: '', Email: '', Password: '' }))
  }

  const EditUser = async (userId: number) => {
    const userFound = users.find(user => user.Id === userId);
    if (userFound) {
      setUser(userFound);
    }
  }

  const DeleteUser = async (userId: number) => {
    const resp = await axios.delete("/api/user", {
      params: { Id: userId }
    }).catch((error) => {
      console.log("catch: ", error.message);
    });

    if (resp && resp.data) {
      console.log('DeleteUser->resp.data: ', resp.data);
      GetUsers();
    }
  };

  // Update specific input field
  const HandleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

  return (
    <main style={{ marginLeft: "1rem", marginTop: "5px" }}>
      <h1>Users</h1>
      <form>
        <input onChange={HandleChange} value={user.Login} type="text" name="Login" placeholder="Login" />
        <br />
        <input onChange={HandleChange} value={user.Email} type="email" name="Email" placeholder="Email" />
        <br />
        <input onChange={HandleChange} value={user.Password} type="password" name="Password" placeholder="Password" />
        <br />
        <div style={{ marginTop: "5px" }}>
          <button onClick={addUser}>Add User</button>
          <button onClick={UpdateUser}>Update User</button>
        </div>
      </form>

      <table style={{ border: 'solid 2px', padding: '5px', marginTop: '12px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Login</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.Id}>
              <td>{user.Id}</td>
              <td>{user.Login}</td>
              <td>{user.Email}</td>
              <td>{user.Password}</td>
              <td>
                <button onClick={() => EditUser(user.Id)}>Editar</button>
                <button onClick={() => DeleteUser(user.Id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}