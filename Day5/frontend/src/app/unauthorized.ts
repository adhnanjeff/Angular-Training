import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";


@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="unauthorized-container">
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
    </div>
    `
})

export class UnauthorizedComponent {}