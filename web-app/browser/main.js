import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
};

///////////


const mini_grid_columns = Tetris.mini_field_width;
const mini_grid_rows = Tetris.mini_field_height;

document.documentElement.style.setProperty("--mini-grid-rows", mini_grid_rows);
document.documentElement.style.setProperty("--mini-grid-columns", mini_grid_columns);

const mini_grid_next = document.getElementById("mini-grid-next");

const mini_cells_next = range(mini_grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "mini-row";

    const rows = range(mini_grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "mini cell";

        row.append(cell);

        return cell;
    });

    mini_grid_next.append(row);
    return rows;
});

//Update the whole mini-grid
const update_mini_grid_next = function () {
    mini_cells_next.forEach((row) => {
        row.forEach((cell) => {
            cell.className = "mini cell";
        })
    })

    Tetris.tetromino_coordiates(game.next_tetromino, [2, 2]).forEach(
        function (coord) {
            try {
                const cell = mini_cells_next[coord[1]][coord[0]];
                cell.className = (
                    `mini cell current ${game.next_tetromino.block_type}` //` allows you to .format like in python 
                );
            } catch (ignore) {

            }
        }
    );
};

// ----- //

const mini_grid_held = document.getElementById("mini-grid-held");

const mini_cells_held = range(mini_grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "mini-row";

    const rows = range(mini_grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "mini cell";

        row.append(cell);

        return cell;
    });

    mini_grid_held.append(row);
    return rows;
});


const update_mini_grid_held = function () {
    mini_cells_held.forEach((row) => {
        row.forEach((cell) => {
            cell.className = "mini cell";
        })
    })

    // if held is null then do nothing, without this line nothing shows because the first instance is that held is null
    if (!game.held_tetromino) {
        return
    }

    Tetris.tetromino_coordiates(game.held_tetromino, [2, 2]).forEach(
        function (coord) {
            try {
                const cell = mini_cells_held[coord[1]][coord[0]];
                cell.className = (
                    `mini cell current ${game.held_tetromino.block_type}` //because we initially set it to null (false) so it won't show anthing, && and, helps do smth with smth that doen't exist. 
                );
            } catch (ignore) {

            }
        }
    );
};

/////////////////

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
    update_mini_grid_next()
    update_mini_grid_held()
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    update_mini_grid_next()
    update_mini_grid_held()
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
update_mini_grid_next()
update_mini_grid_held()

//console.log (game.held_tetromino)