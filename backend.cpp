#include <iostream>
#include <fstream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>

// Estructura para almacenar las traducciones de una palabra
struct Traduccion {
    std::string italiano;
    std::string frances;
    std::string aleman;
    std::string ingles;
};

// Nodo del árbol AVL
struct Nodo {
    std::string palabra;
    Traduccion traduccion;
    Nodo* izq;
    Nodo* der;
    int altura;

    Nodo(std::string p, Traduccion t)
        : palabra(p), traduccion(t), izq(nullptr), der(nullptr), altura(1) {}
};

// Funciones para manejar el árbol AVL
int altura(Nodo* n) {
    return n ? n->altura : 0;
}

int max(int a, int b) {
    return (a > b) ? a : b;
}

Nodo* rotarDerecha(Nodo* y) {
    Nodo* x = y->izq;
    Nodo* T2 = x->der;
    x->der = y;
    y->izq = T2;
    y->altura = max(altura(y->izq), altura(y->der)) + 1;
    x->altura = max(altura(x->izq), altura(x->der)) + 1;
    return x;
}

Nodo* rotarIzquierda(Nodo* x) {
    Nodo* y = x->der;
    Nodo* T2 = y->izq;
    y->izq = x;
    x->der = T2;
    x->altura = max(altura(x->izq), altura(x->der)) + 1;
    y->altura = max(altura(y->izq), altura(y->der)) + 1;
    return y;
}

int obtenerBalance(Nodo* N) {
    return N ? altura(N->izq) - altura(N->der) : 0;
}

Nodo* insertar(Nodo* nodo, std::string palabra, Traduccion traduccion) {
    if (!nodo) return new Nodo(palabra, traduccion);
    if (palabra < nodo->palabra)
        nodo->izq = insertar(nodo->izq, palabra, traduccion);
    else if (palabra > nodo->palabra)
        nodo->der = insertar(nodo->der, palabra, traduccion);
    else
        return nodo;

    nodo->altura = 1 + max(altura(nodo->izq), altura(nodo->der));
    int balance = obtenerBalance(nodo);

    if (balance > 1 && palabra < nodo->izq->palabra)
        return rotarDerecha(nodo);
    if (balance < -1 && palabra > nodo->der->palabra)
        return rotarIzquierda(nodo);
    if (balance > 1 && palabra > nodo->izq->palabra) {
        nodo->izq = rotarIzquierda(nodo->izq);
        return rotarDerecha(nodo);
    }
    if (balance < -1 && palabra < nodo->der->palabra) {
        nodo->der = rotarDerecha(nodo->der);
        return rotarIzquierda(nodo);
    }
    return nodo;
}

// Función para cargar las palabras desde un archivo
Nodo* cargarDesdeArchivo(const std::string& nombreArchivo, Nodo* raiz) {
    std::ifstream archivo(nombreArchivo);
    if (!archivo.is_open()) {
        std::cerr << "No se puede abrir el archivo.\n";
        return nullptr;
    }

    std::string linea;
    while (getline(archivo, linea)) {
        std::istringstream iss(linea);
        std::string palabra, italiano, frances, aleman, ingles;
        if (!(iss >> palabra >> italiano >> frances >> aleman >> ingles)) {
            continue;
        }
        Traduccion traduccion = {italiano, frances, aleman, ingles};
        raiz = insertar(raiz, palabra, traduccion);
    }
    archivo.close();
    return raiz;
}

// Función para agregar una nueva palabra
Nodo* agregarPalabra(Nodo* raiz, const std::string& palabra, Traduccion traduccion) {
    return insertar(raiz, palabra, traduccion);
}

// Función para encontrar el nodo con el valor mínimo
Nodo* nodoMinimo(Nodo* nodo) {
    Nodo* actual = nodo;
    while (actual->izq != nullptr)
        actual = actual->izq;
    return actual;
}

// Función para eliminar un nodo
Nodo* eliminarNodo(Nodo* raiz, const std::string& palabra) {
    if (!raiz) return raiz;

    if (palabra < raiz->palabra)
        raiz->izq = eliminarNodo(raiz->izq, palabra);
    else if (palabra > raiz->palabra)
        raiz->der = eliminarNodo(raiz->der, palabra);
    else {
        if ((raiz->izq == nullptr) || (raiz->der == nullptr)) {
            Nodo* temp = raiz->izq ? raiz->izq : raiz->der;
            if (!temp) {
                temp = raiz;
                raiz = nullptr;
            } else
                *raiz = *temp;
            delete temp;
        } else {
            Nodo* temp = nodoMinimo(raiz->der);
            raiz->palabra = temp->palabra;
            raiz->traduccion = temp->traduccion;
            raiz->der = eliminarNodo(raiz->der, temp->palabra);
        }
    }

    if (!raiz) return raiz;

    raiz->altura = 1 + max(altura(raiz->izq), altura(raiz->der));
    int balance = obtenerBalance(raiz);

    if (balance > 1 && obtenerBalance(raiz->izq) >= 0)
        return rotarDerecha(raiz);
    if (balance > 1 && obtenerBalance(raiz->izq) < 0) {
        raiz->izq = rotarIzquierda(raiz->izq);
        return rotarDerecha(raiz);
    }
    if (balance < -1 && obtenerBalance(raiz->der) <= 0)
        return rotarIzquierda(raiz);
    if (balance < -1 && obtenerBalance(raiz->der) > 0) {
        raiz->der = rotarDerecha(raiz->der);
        return rotarIzquierda(raiz);
    }
    return raiz;
}

// Función para imprimir el árbol (inorder)
void inorder(Nodo* raiz) {
    if (raiz != nullptr) {
        inorder(raiz->izq);
        std::cout << raiz->palabra << " -> " << raiz->traduccion.italiano << ", "
                  << raiz->traduccion.frances << ", " << raiz->traduccion.aleman << ", "
                  << raiz->traduccion.ingles << std::endl;
        inorder(raiz->der);
    }
}

int main() {
    Nodo* raiz = nullptr;

    raiz = cargarDesdeArchivo("palabras.txt", raiz);

    Traduccion nuevaTraduccion = {"nuovo_italiano", "nouveau_frances", "neue_aleman", "new_ingles"};
    raiz = agregarPalabra(raiz, "nueva_palabra", nuevaTraduccion);

    raiz = eliminarNodo(raiz, "palabra_a_eliminar");

    inorder(raiz);

    return 0;
}
