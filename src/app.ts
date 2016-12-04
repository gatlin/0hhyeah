import { el, App } from './alm/alm';
import { Grid } from './grid';

const app = new App<Grid>({
    state: new Grid(8).initialize(),
    update: (action, grid) => {
        if (action['type'] === 'click') {
            const coords = action.data;
            console.log('touched grid cell x = ' +
                coords[0] + ', y = ' + coords[1]);
            grid = grid.toggle(coords[0], coords[1]);
        }

        if (action['type'] === 'solve') {
            grid.solve();
        }

        if (action['type'] === 'generate') {
            grid.initialize().generate();
        }

        return grid;
    },
    main: scope => {
        scope.events.click
            .filter(evt => evt.hasClass('grid-cell'))
            .recv(evt => {
                const coordStr = evt.getId().split('-')[2];
                const coords = coordStr.split(':').map(x => parseInt(x));
                scope.actions.send({
                    'type': 'click',
                    'data': coords
                });
            });

        scope.events.click
            .filter(evt => evt.getId() === 'solve-btn')
            .recv(evt => {
                scope.actions.send({
                    'type': 'solve'
                });
            });

        scope.events.click
            .filter(evt => evt.getId() === 'generate-btn')
            .recv(evt => {
                scope.actions.send({
                    'type': 'generate'
                });
            });
    },
    render: (grid) => grid.render(),
    eventRoot: 'app',
    domRoot: 'app'
}).start();
