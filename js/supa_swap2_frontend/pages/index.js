import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import styled from 'styled-components'
import MyForm from '../components/MyForm.js'
import MyFormTwo from '../components/MyFormTwo.js'

const StyledButton = styled.button`
padding-top: 1rem;
padding-bottom: 1rem;
padding-left: 3rem;
padding-right: 3rem;
margin-bottom: 1rem;
width: 400px;
color: black ;
background: white;
display: flex;
justify-content: center;
align-items: center;
font-size: 24px;
font-weight: bold;
border-radius: 60px;
border: 3px solid;
border-color: black;
&:hover {
  outline: none;
  border: 3px solid;
  border-color: black;
  background: black;
  color: white;
}
`;
const StyledButtonTwo = styled.button`
padding-top: 1rem;
padding-bottom: 1rem;
padding-left: 3rem;
padding-right: 3rem;
width: 400px;
color: white;
background: black;
display: flex;
justify-content: center;
align-items: center;
font-size: 24px;
font-weight: bold;
border-radius: 60px;
border: 3px solid;
border-color: black;
&:hover {
  border-color: black;
  background: white;
  color: black;
}
`;

const StyledSection = styled.div`
  height: 300px;
  width: 400px;
  background-color: white;
  border-radius: 25px;
  float: left;
  border: 3;
  border: 3px solid;
  border-color: black;
`

const StyledDescription = styled.h4`
color: #202020; 
display: flex;
justify-content: center;
font-size: 24px;
font-weight: lighter;
fkex
`

const StyledFooter = styled.h6`
color: white; 
display: flex;
justify-content: center;
font-size: 24px;
font-weight: bold;
`

const SmallerSourceImage = styled.h6`
display: flex;
justify-content: center;
`


export default function Home() {



  return (
    <div className={styles.container}>
      <Head>
        <title>SupaSwap</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        SupaSwap
        </h1>
        <StyledButton>
            Connect Your Wallet
          </StyledButton>
        <StyledSection>
          <StyledDescription>
            <MyForm />
          </StyledDescription>
          <StyledDescription>
            <MyFormTwo />
          </StyledDescription>
        </StyledSection>
        <p className={styles.description}>
          
          <StyledButtonTwo>
            Send
          </StyledButtonTwo>

        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://solana.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledFooter>Powered by{' '}</StyledFooter>
          <SmallerSourceImage> </SmallerSourceImage>
          <span className={styles.logo}>
          <img 
          src="https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdark-horizontal.c3a5eb36.svg&w=384&q=75"
          alt="new"
          />
          </span>
        </a>
      </footer>
    </div>
  )
}
