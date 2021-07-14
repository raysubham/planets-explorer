import { Footer as ArwesFooter, Paragraph } from 'arwes'
import Centered from './Centered'

const Footer = () => {
  return (
    <ArwesFooter animate>
      <Centered>
        <Paragraph
          style={{
            fontSize: 14,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Made by Subham Ray
        </Paragraph>
      </Centered>
    </ArwesFooter>
  )
}

export default Footer
