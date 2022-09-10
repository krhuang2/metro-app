/*
    An array of NexTripRoute elements is returned by the GetRoutes operation. Each element consists of the fields:
    Description - description of the route.
    ProviderID - identifier that corresponds to elements returned by the GetProviders operation.
    Route - route number or label.
*/
// export interface NexTripRoutes{
//     routes: NexTripRoute[];
// }

export interface INexTripRoute{
    route_id: string;
    agency_id: number;
    route_label: string;
}

export interface IDirection {
    direction_id: number;
    direction_name: string;
}

export interface IStop {
    place_code: string;
    description: string;
}