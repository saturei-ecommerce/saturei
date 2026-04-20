import Image from 'next/image'
import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'
import { Button } from '../ui/button'
import { loginWithGithubAction, loginWithGoogleAction } from './actions'

export function SocialLogin() {
  return (
    <div className="flex items-center gap-2">
      <form action={loginWithGoogleAction} className="w-1/2">
        <Button variant="outline" className="w-full h-10">
          <Image src={googleIcon} alt="Google Icon" className="size-4" />
          Continue com o Google
        </Button>
      </form>
      <form action={loginWithGithubAction} className="w-1/2">
        <Button variant="outline" className="w-full h-10">
          <Image src={githubIcon} alt="Google Icon" className="size-4" />
          Continue com o Github
        </Button>
      </form>
    </div>
  )
}
