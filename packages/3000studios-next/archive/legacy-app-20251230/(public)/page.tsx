import FullscreenVideo from '@/components/FullscreenVideo'

export default function Landing() {
  return (
    <FullscreenVideo
      src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986138/3000_studios_back_dop_z4amap.mp4"
      button={{
        label: 'CLICK ME',
        nextVideo: 'https://res.cloudinary.com/dj92eb97f/video/upload/v1766986144/3D_tunnel_to_purple_d7cofd.mp4',
        redirect: '/home',
      }}
    />
  )
}

