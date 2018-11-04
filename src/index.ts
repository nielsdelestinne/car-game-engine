
export default class Runner {

    public component() {
        let element = document.createElement('div');

        element.innerHTML = 'Hello Typescript';

        return element;
    }

}

const myRunner: Runner = new Runner();

document.body.appendChild(myRunner.component());