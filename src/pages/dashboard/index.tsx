import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";

import { canSSRAuth } from "@/src/utils/canSSRAuth";

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>BarebrPro - Minha barbearia</title>
            </Head>
            <Flex>
                <Text>Bem vindo ao dashboard</Text>
            </Flex>
        </>
    )
}

//rota protegida
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {

        }
    }
})