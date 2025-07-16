export interface AboutRoot {
    status: string
    message: string
    data: AboutData[]
  }
  
  export interface AboutData {
    _id: string
    videoUrl: string
    description: string
    __v: number
  }
  