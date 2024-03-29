import { DOCUMENT } from '@angular/common';
import { Component, OnInit, AfterViewInit, HostListener, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Cell, Maze, keyboardMap } from './models';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css', './maze.component.scss'],
})
export class MazeComponent implements OnInit, AfterViewInit {
  row = 10;
  col = 10;
  cellSize = 20; // cell size
  private maze: Maze;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell: Cell;

  loading: boolean = true;

  constructor(
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private metaService:Meta
    ) {
      this.setMetaTag();
    // this.titleService.setTitle('Ewumesh | Game | Online Maze Game');

    //         this.metaService.addTags([
    //           { name: 'keywords', content: 'Frontend, software, developer, Nepal, Umesh, Ewumesh, ewumesh, nepali, blogs, medium, coding, javascript, productivity, games, game, online game, live' },
    //           { name: 'description', content: 'A maze game is a type of puzzle game that involves navigating through a complex network of paths and obstacles to reach a specific goal. The goal is typically represented by a specific location within the maze, such as a treasure chest, a key, or a final exit.' },
    //           { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //           { name: 'date', content: '2023-03-17', scheme: 'YYYY-MM-DD' },
    //           { name: 'robots', content: 'index, follow' },
    //         ]);
  }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  ngAfterViewInit() {
    // if (typeof document !== "undefined"){
    this.canvas = <HTMLCanvasElement>document.getElementById('maze');
    this.ctx = this.canvas.getContext('2d');
    this.drawMaze();
    // }
  }

  drawMaze() {
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = this.col * this.cellSize;
    this.canvas.height = this.row * this.cellSize;
    this.maze.draw();
    this.initPlay();
  }

  initPlay(lineThickness = 10, color = '#4080ff') {
    this.gameOver = false;
    this.myPath.length = 0;
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
    this.currentCell = this.maze.cells[0][0];
    this.myPath.push(this.currentCell);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    const direction = keyboardMap[event.key];
    if (direction) this.move(direction);
  }

  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    let nextCell: Cell;
    if (direction === 'Left') {
      if (this.currentCell.col < 1) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col - 1
      ];
    }
    if (direction === 'Right') {
      if (this.currentCell.col + 1 >= this.col) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col + 1
      ];
    }
    if (direction === 'Up') {
      if (this.currentCell.row < 1) return;
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
      ];
    }
    if (direction === 'Down') {
      if (this.currentCell.row + 1 >= this.row) return;
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
      ];
    }
    if (this.currentCell.hasConnectionWith(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        this.maze.erasePath(this.myPath);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(new Cell(this.row - 1, this.col - 1))) {
          this.hooray();
          this.gameOver = true;
          this.maze.drawSolution('#4080ff');
          return;
        }
      }

      this.maze.drawPath(this.myPath);
      this.currentCell = nextCell;
    }
  }

  solution() {
    this.gameOver = true;
    this.maze.drawSolution('#ff7575', 3);
  }

  private hooray() {
    var audio = new Audio('assets/KidsCheering.mp3');
    audio.play();
  }

  private setMetaTag() {
    this.titleService.setTitle('Ewumesh | Play Online Game | Online Maze Game');
    this.metaService.addTags([
      {
        property: 'og:title',
        content: `${'Ewumesh | Game | Online Maze Game'}`,
      },
      {
        property: 'og:url',
        content: `${window.location.href}`,
      },

      {
        property: 'og:description',
        content: `${'A maze game is a type of puzzle game that involves navigating through a complex network of paths and obstacles to reach a specific goal. The goal is typically represented by a specific location within the maze, such as a treasure chest, a key, or a final exit.'}`,
      },
      {
        property: 'og:type',
        content: `article`,
      },
      {
        property: 'og:site_name',
        content: `Ewumesh`,
      },
      {
        property: 'og:image',
        content: `${'https://ewumesh.com/assets/images/maze.webp'}`,
      },

      {
        property: 'twitter:card',
        content: `summary_large_image`,
      },

      {
        property: 'twitter:site',
        content: `@ewumesh`,
      },
      {
        property: 'twitter:title',
        content: `${'Ewumesh | Game | Online Maze Game'}`,
      },
      {
        property: 'twitter:description',
        content: `${'A maze game is a type of puzzle game that involves navigating through a complex network of paths and obstacles to reach a specific goal. The goal is typically represented by a specific location within the maze, such as a treasure chest, a key, or a final exit.'}`,
      },
      {
        property: 'twitter:image',
        content: `${'https://ewumesh.com/assets/images/maze.webp'}`,
      },
      {
        property: 'twitter:url',
        content: `${window.location.href}`,
      },
      {
        name: 'twitter:name:alt',
        content: `${window.location.href}`,
      },
    ]);
  }
}
