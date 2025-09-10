import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { throwError } from "rxjs/internal/observable/throwError";
import { catchError } from "rxjs/internal/operators/catchError";

@Injectable()
export class ErrorInterceptor {
    static withErrorHandling(messageService: MessageService, router : Router) : HttpInterceptorFn {
        return(req, next) => {
            return next(req).pipe(
                catchError((error : HttpErrorResponse) => {
                    let errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
                    
                    console.error('Handled by global error interceptor:', error);
                    
                    if (error.status === 0) {
                        messageService.add({severity:'error', summary:'Network Error', detail:'Unable to connect to server'});
                    } else if (error.status === 400) {
                        messageService.add({severity:'error', summary:'Bad Request', detail:errorMessage});
                    } else if (error.status === 401) {
                        messageService.add({severity:'error', summary:'Unauthorized', detail:'Invalid username or password'});
                        if (!req.url.includes('/login')) {
                            router.navigate(['/login']);
                        }
                    } else if (error.status === 403) {
                        messageService.add({severity:'error', summary:'Forbidden', detail:'Access denied'});
                        router.navigate(['/unauthorized']);
                    } else if (error.status === 404) {
                        messageService.add({severity:'error', summary:'Not Found', detail:errorMessage});
                    } else if (error.status === 409) {
                        messageService.add({severity:'error', summary:'Conflict', detail:errorMessage});
                    } else if (error.status === 422) {
                        messageService.add({severity:'error', summary:'Validation Error', detail:errorMessage});
                    } else if (error.status === 500) {
                        messageService.add({severity:'error', summary:'Server Error', detail:'Internal server error occurred'});
                    } else {
                        messageService.add({severity:'error', summary:'Error', detail:errorMessage});
                    }
                    return throwError(() => error);
                })
            );
        }
    }
}