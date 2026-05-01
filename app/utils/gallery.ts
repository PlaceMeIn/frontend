
export const create_gallery_slug_link =  (event: any) => {
  if(!event) return null
  if (event?.event_slug){
    return `/gallery/${event.event_slug}?type=event`
  }else if (event?.project_slug){
    return `/gallery/${event.project_slug}?type=project`
  }else if (event?.scene_slug){
    return `/gallery/${event.scene_slug}?type=scene`
  }else{
    return null
  }
}