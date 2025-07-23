export class ToolTypeDTO {
    displayName?: String | null;
    toolType?: string | null;
    description?: string | null;
    compId?: number
    constructor(displayName: string, toolType: string, description: string, compId: number) {
        this.displayName = displayName;
        this.toolType = toolType;
        this.description = description;
        this.compId = compId;
    }

}    