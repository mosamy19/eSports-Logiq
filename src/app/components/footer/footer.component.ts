import { Component, OnInit, isDevMode } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'footer-box',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    providers: [DefaultService, TranslatePipe]

})
export class FooterComponent implements OnInit {

    constructor(private translate: TranslatePipe, private defaultService: DefaultService, private router: Router, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

    }

}