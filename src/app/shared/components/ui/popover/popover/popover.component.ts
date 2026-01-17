import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  TemplateRef,
  ContentChild,
  Renderer2
} from '@angular/core';

type Position = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-popover',
  imports: [CommonModule],
  templateUrl: './popover.component.html',
  styles: ``,
  exportAs: 'appPopover'
})
export class PopoverComponent {

  @Input() position: Position = 'top';

  @ContentChild('popoverTrigger', { read: TemplateRef }) triggerTpl!: TemplateRef<any>;
  @ContentChild('popoverContent', { read: TemplateRef }) contentTpl!: TemplateRef<any>;

  @ViewChild('popoverRef') popoverRef!: ElementRef;
  @ViewChild('triggerRef') triggerRef!: ElementRef;

  isOpen = false;
  private clickListener: (() => void) | undefined;

  constructor(private renderer: Renderer2, private host: ElementRef) {}

  ngAfterViewInit() {
    this.clickListener = this.renderer.listen('document', 'mousedown', (event: MouseEvent) => {
      if (
        this.isOpen &&
        this.popoverRef &&
        !this.popoverRef.nativeElement.contains(event.target) &&
        this.triggerRef &&
        !this.triggerRef.nativeElement.contains(event.target)
      ) {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.clickListener) this.clickListener();
  }

  togglePopover() {
    this.isOpen = !this.isOpen;
  }
 
  close() {
    this.isOpen = false;
  }

  get positionClasses(): string {
    return {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
    }[this.position]!;
  }

  get arrowClasses(): string {
    return {
      top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45',
      right: 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 rotate-45',
      bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
      left: 'right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 rotate-45'
    }[this.position]!;
  }
}
