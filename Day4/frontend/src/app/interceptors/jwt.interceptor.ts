import { Injectable } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";


@Injectable()
export class JwtInterceptor {
    static withToken : HttpInterceptorFn = (req, next) => {
        const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
        if (token) {
            const clonedToken = req.clone({
                headers: req.headers.set("Authorization", "Bearer" + token)
            });
            return next(clonedToken);
        } else {
            return next(req);
        }
    }
}