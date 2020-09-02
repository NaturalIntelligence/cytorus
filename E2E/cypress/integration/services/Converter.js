const xmlRegex = new RegExp("<.+>.+</.+>", "g");

export default class Converter{
    constructor(obj){
        this.map = [
            { from: "xml", to: "json"},
            { from: "xml", to: "nimn"},
            { from: "json", to: "xml"}
        ]

        this.valid = false;
        for (let index = 0; index < this.map.length; index++) {
            const element = this.map[index];
            if(element.from === obj.from && element.to === obj.to){
                this.valid = true;
                break;
            }
        }

        this.config = obj;
    }

    convert(data){
        
        if(!this.valid){
            return 400;
        }else{
            //console.log("Converting", this.config )
            //console.log(data)
            if(data.match(xmlRegex)){
                if(this.config.from === "xml") return 200;
                else return 400;
            }else if(typeof data === "object"){
                if(this.config.from === "json") return 200;
                else return 400;
            }
        }
    }

}