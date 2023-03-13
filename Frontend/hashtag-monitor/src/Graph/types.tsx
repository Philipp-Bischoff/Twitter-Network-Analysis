export namespace Types{

    export type Node = {
        name: string | null;
    }
    
    export type Link = {
        source: string;
        target: string;
    }

    export type DataObject = {
        nodes: Node[] | null
        links: Link[] | null
    }

}