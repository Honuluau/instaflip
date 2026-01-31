export namespace backend {
	
	export class FlipRowItem {
	    ID: number;
	    EagleID: string;
	    FlipTime: string;
	
	    static createFrom(source: any = {}) {
	        return new FlipRowItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.EagleID = source["EagleID"];
	        this.FlipTime = source["FlipTime"];
	    }
	}

}

