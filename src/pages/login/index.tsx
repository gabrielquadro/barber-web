import { useState, useContext } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import logoImg from "../../../public/images/logo.svg"
import { Center, Flex, Text, Input, Button } from "@chakra-ui/react"
import { AuthContext } from "@/src/context/AuthContext"
import { canSSRGuest } from "@/src/utils/canSSRGuest"


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext)

  async function handleLogin() {
    if (email === '' || password === '') {
      return;
    }
    await signIn({
      email,
      password
    })
  }

  return (
    <>
      <Head>
        <title>BarberPro - Faça login para acessar</title>
      </Head>
      <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image
              src={logoImg}
              quality={100}
              objectFit="fill"
              alt="Logo barberPro"
            >
            </Image>
          </Center>

          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="Digite seu e-mail"
            type="email"
            textColor="barber.default"
            mb={3}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
          </Input>
          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="Digite sua senha"
            type="text"
            textColor="barber.default"
            mb={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
          </Input>

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#ffb13e" }}
            onClick={handleLogin}
          >
            Acessar
          </Button>

          <Center mt={2}>
            <Link href="/register">
              <Text cursor="pointer" color="barber.default">Ainda não possui uma conta? <strong>Cadastre-se</strong></Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  )
}

//rota public
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
      props: {

      }
  }
})