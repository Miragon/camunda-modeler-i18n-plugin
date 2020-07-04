import Ids from 'ids';

const ids = new Ids([ 32, 36, 1 ]);

export default function generateId() {
    return ids.next();
}