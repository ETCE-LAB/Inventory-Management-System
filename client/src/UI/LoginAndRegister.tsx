import { Flex, TextInput, Title, UnstyledButton, Button, Card, Text, Loader, Transition } from '@mantine/core';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../Hooks';
import { registerAsync, resetError, selectUser, signInAsync } from '../state/UserState';

export const LoginAndRegister = () => {
    const userState = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const [selectedPage, setSelectedPage] = useState(0);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const slideLeft = {
        in: { opacity: 1, transform: 'translateX(0)' },
        out: { opacity: 0, transform: 'translateX(-100%)' },
        common: { transformOrigin: 'left' },
        transitionProperty: 'transform, opacity',
    };

    const slideRight = {
        in: { opacity: 1, transform: 'translateX(0)' },
        out: { opacity: 0, transform: 'translateX(100%)' },
        common: { transformOrigin: 'right' },
        transitionProperty: 'transform, opacity',
    };

    return (
        <Flex h="100vh" justify="center" align="center" style={{ overflow: 'hidden', position: 'relative' }}>
            <Transition mounted={selectedPage === 0} transition={slideLeft} duration={500} timingFunction="ease">
                {(styles) => (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        style={{
                            ...styles,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            margin: 'auto',
                            height: 'fit-content',
                        }}
                    >
                        <Card shadow="sm" padding="lg" radius="md" withBorder w="350px">
                            {userState.status === 'loading' && (
                                <Flex direction="column" align="center" justify="center" h="100%">
                                    <Loader color="red.3" />
                                    <Flex justify="center" align="center">
                                        <Text mt="md">Loading...</Text>
                                    </Flex>
                                </Flex>
                            )}
                            {userState.status === 'failed' && (
                                <>
                                    <Title mb="10px" order={4}>Login failed</Title>
                                    <Text mb="25px">{userState.errorText}</Text>
                                    <Flex justify="flex-end">
                                        <Button color="pink.5" onClick={() => { dispatch(resetError()) }}>
                                            Back to Login
                                        </Button>
                                    </Flex>
                                </>
                            )}
                            {userState.status === 'idle' && (
                                <>
                                    <Title order={4} mb="10px">Login</Title>
                                    <TextInput
                                        mb="5px"
                                        mt="5px"
                                        placeholder="Enter Email"
                                        description="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.currentTarget.value)}
                                    />
                                    <TextInput
                                        mb="5px"
                                        description="Password"
                                        placeholder="Enter Password"
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.currentTarget.value)}
                                    />
                                    <Text mb="5px">
                                        No Account? Click
                                        <UnstyledButton onClick={() => setSelectedPage(1)}>
                                            <Text color="red.3" p="5px" mb="5px" mt="5px">here</Text>
                                        </UnstyledButton>
                                        to register
                                    </Text>
                                    <Flex justify="flex-end">
                                        <Button
                                            onClick={() => {
                                                dispatch(signInAsync({ email, password }))
                                            }}
                                            autoContrast
                                            color="pink.5"
                                        >
                                            Login
                                        </Button>
                                    </Flex>
                                </>
                            )}
                        </Card>
                    </Flex>
                )}
            </Transition>

            <Transition mounted={selectedPage === 1} transition={slideRight} duration={500} timingFunction="ease">
                {(styles) => (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        style={{
                            ...styles,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            margin: 'auto',
                            height: 'fit-content',
                        }}
                    >
                        <Card shadow="sm" padding="lg" radius="md" withBorder w="350px">
                            {userState.status === 'loading' && (
                                <Flex direction="column" align="center" justify="center" h="100%">
                                    <Loader color="red.3" />
                                    <Flex justify="center" align="center">
                                        <Text mt="md">Loading...</Text>
                                    </Flex>
                                </Flex>
                            )}
                            {userState.status === 'failed' && (
                                <>
                                    <Title order={4}>Register failed</Title>
                                    <Text>{userState.errorText}</Text>
                                    <Flex justify="flex-end">
                                        <Button color="pink.5" onClick={() => { dispatch(resetError()) }}>
                                            Back to Register
                                        </Button>
                                    </Flex>
                                </>
                            )}
                            {userState.status === 'idle' && (
                                <>
                                    <Title mb="10px" order={4}>Register</Title>
                                    <TextInput
                                        mb="5px"
                                        placeholder="Enter Username"
                                        description="Username"
                                        type="text"
                                        value={username}
                                        onChange={(event) => setUsername(event.currentTarget.value)}
                                    />
                                    <TextInput
                                        mb="5px"
                                        placeholder="Enter Email"
                                        description="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.currentTarget.value)}
                                    />
                                    <TextInput
                                        mb="5px"
                                        placeholder="Enter Password"
                                        description="Password"
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.currentTarget.value)}
                                    />
                                    <Text mb="5px">
                                        Already got an Account? Click
                                        <UnstyledButton onClick={() => setSelectedPage(0)}>
                                            <Text color="red.3" p="5px" mb="5px" mt="5px">here</Text>
                                        </UnstyledButton>
                                        to login
                                    </Text>
                                    <Flex justify="flex-end">
                                        <Button color="pink.5" onClick={() => { dispatch(registerAsync({ username, email, password })) }}>
                                            Register
                                        </Button>
                                    </Flex>
                                </>
                            )}
                        </Card>
                    </Flex>
                )}
            </Transition>
        </Flex>
    );
};
