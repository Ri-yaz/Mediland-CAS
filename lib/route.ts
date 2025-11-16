
type RouteAccessProps ={
    [key: string]: string[];
}


export const routeAccess :  RouteAccessProps = {

    "/admin(.*)": ["admin"],
     "/patient(.*)": ["admin", "patient","doctor"],
}