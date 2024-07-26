import { AppShell, Burger, Flex, Button,UnstyledButton, Drawer, Card, Text, Group, Badge, TextInput, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import {useAppDispatch, useAppSelector } from '../Hooks';
import { User } from '../Models/User';
import { promoteUserAsync, selectAccounts} from '../state/AccountsState';
export const Accounts = () => {
    
    const accountsState = useAppSelector(selectAccounts)

    const dispatch = useAppDispatch()

    const [searchTerm, setSearchTerm] = useState("")

    const [openedPromoteToEmployee, handlerPromoteToEmployee] = useDisclosure(false)

    const [openedPromoteToProf, handlerPromoteToProf] = useDisclosure(false)



    const [user, setUser] = useState<User>()
    
    return <>
        <div style={{padding: "15px", paddingTop: "90px"}}>

            <Modal opened={openedPromoteToEmployee} onClose={() => {
                handlerPromoteToEmployee.close()
            }} title="Promote to Employee">
                <Text>Do you really wanna promote {user?.username} to an Employee?</Text>
                <br />

                <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                    <Button color={"red.3"} onClick={() => {
                        dispatch(promoteUserAsync(user!._id)).unwrap().then(() => {
                            handlerPromoteToEmployee.close()
                        })
                    }}>Promote</Button>

                </div>
            </Modal>

            <Modal opened={openedPromoteToProf} onClose={() => {
                handlerPromoteToProf.close()
            }} title="Promote to Employee">
                <Text>Do you really wanna promote {user?.username} to a Professor?</Text>
                <br />

                <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                    <Button color={"red.3"} onClick={() => {
                        dispatch(promoteUserAsync(user!._id)).unwrap().then(() => {
                            handlerPromoteToProf.close()
                        })
                    }}>Promote</Button>

                </div>
            </Modal>

            <div style={{ width:"100%", position: 'fixed',left:"0px", padding: "15px", top: '50px', zIndex: '1',paddingTop: "10px",paddingBottom: "15px"}}>
                <TextInput
                    style={{  }}
                    description="Find User"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            {
                filterUsers(accountsState.accounts, searchTerm).map(account => {
                    return <Card shadow="sm" padding="xs" mb="10px" radius="md" withBorder>


                        <Text size="xs" c="dimmed">
                            Id
                        </Text>
                        <Text>
                            {account._id}
                        </Text>

                        <Group justify="space-between" mt="xs" mb="xs">
                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                <Text size="xs" c="dimmed">
                                    Username
                                </Text>
                                <Text>
                                    {account.username}
                                </Text>
                            </div>

                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                <Text size="xs" c="dimmed">
                                    Email
                                </Text>
                                <Text>
                                    {account.email}
                                </Text>
                            </div>
                        </Group>

                        <Group justify="space-between" mt="xs" mb="xs">

                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                <Text size="xs" c="dimmed" mb={"3px"}>
                                    Role
                                </Text>
                                {account.role == 0 && <Badge color="green">Student</Badge>}
                                {account.role == 1 && <Badge color="yellow">Employee</Badge>}
                                {account.role == 2 && <Badge color="orange">Profesor</Badge>}
                            </div>



                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                <Text size="xs" c="dimmed">
                                    Created
                                </Text>
                                <Text>
                                    {Intl.DateTimeFormat("de-DE", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                        timeZone: "UTC",
                                    }).format(new Date(account.createdAt))}
                                </Text>
                            </div>
                        </Group>


                        <Group justify="flex-end" align="center" mt="xs" mb="xs">

                            {account.role == 0 && <Button onClick={() => {setUser(account); handlerPromoteToEmployee.open()}}>Promote</Button>}
                            {account.role == 1 && <Button onClick={() => {setUser(account); handlerPromoteToProf.open()}}>Promote</Button>}

                        </Group>

                    </Card>
                })
            }
        </div>
    </>
}

function filterUsers(users: User[], searchTerm: string): User[] {
    const filteredUsers = users.filter(user =>
        user.email.includes(searchTerm) || user.username.includes(searchTerm)
    );
    return filteredUsers;
}