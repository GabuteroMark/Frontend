import { Pipe, PipeTransform } from '@angular/core';
import { GradeLevel } from './ai-question.service';

@Pipe({
    name: 'filterByLevel'
})
export class FilterByLevelPipe implements PipeTransform {
    transform(levels: GradeLevel[], academicLevel: string): GradeLevel[] {
        if (!levels) return [];
        return levels.filter(l => l.academicLevel === academicLevel);
    }
}
