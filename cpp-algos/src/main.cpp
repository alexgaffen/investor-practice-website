// cpp-algos/src/main.cpp
#include "crow_all.h"  // Make sure you have Crow header(s) available

int main()
{
    crow::SimpleApp app;

    // Define a simple endpoint, e.g., /analyze that returns a dummy trading signal
    CROW_ROUTE(app, "/analyze")
    ([](){
        return "Trade Signal: BUY";
    });

    // Listen on port 8080
    app.port(8080).multithreaded().run();
    return 0;
}