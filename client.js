document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  const colorInput = document.getElementById('color-input');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeDisplay = document.getElementById('brush-size-display');
  const clearButton = document.getElementById('clear-button');
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');

  let boardState = [];

  function resizeCanvas() {
    // TODO: Set the canvas width and height based on its parent element
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Redraw the canvas with the current board state when resized
    // TODO: Call redrawCanvas() function
    redrawCanvas(boardState);
  }

  // Initialize canvas size
  // TODO: Call resizeCanvas()
  resizeCanvas();
  
  // Handle window resize
  // TODO: Add an event listener for the 'resize' event that calls resizeCanvas
  window.addEventListener('resize', resizeCanvas);

  // Drawing variables
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Connect to Socket.IO server
  // TODO: Create a socket connection to the server at 'http://localhost:3000'
  const socket = io('http://localhost:3000');

  // TODO: Set up Socket.IO event handlers
  socket.on('connect', () => {
    connectionStatus.textContent = 'Connected';
    console.log('Connected to server with ID:', socket.id);
  })
  // Canvas event handlers
  // TODO: Add event listeners for mouse events (mousedown, mousemove, mouseup, mouseout)
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing); 

  // Touch support (optional)
  // TODO: Add event listeners for touch events (touchstart, touchmove, touchend, touchcancel)
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchcancel', stopDrawing);

  // Clear button event handler
  // TODO: Add event listener for the clear button
  clearButton.addEventListener('click', clearCanvas);

  // Update brush size display
  // TODO: Add event listener for brush size input changes
  brushSizeInput.addEventListener('input', () => {
    brushSizeDisplay.textContent = brushSizeInput.value;
  });

  function startDrawing(e) {
    // TODO: Set isDrawing to true and capture initial coordinates
    isDrawing = true;
    const {x,y} = getCoordinates(e);
    lastX = x;
    lastY = y;
  }

  function draw(e) {
    // TODO: If not drawing, return
    if (!isDrawing) return;
    
    // TODO: Get current coordinates
    const {x, y} = getCoordinates(e);
    // TODO: Emit 'draw' event to the server with drawing data
    socket.emit('draw', { 
      x0: lastX, 
      y0: lastY, 
      x1: x, 
      y1: y, 
      color: colorInput.value, 
      size: brushSizeInput.value 
    });
    // TODO: Update last position
    lastX = x;
    lastY = y;
  }

  function drawLine(x0, y0, x1, y1, color, size) {
    // TODO: Draw a line on the canvas using the provided parameters
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = size;
    context.stroke();
    context.closePath();
  }

  function stopDrawing() {
    // TODO: Set isDrawing to false
    isDrawing = false;
  }

  function clearCanvas() {
    // TODO: Emit 'clear' event to the server
    socket.emit('clear');
  }

  function redrawCanvas(boardState = []) {
    // TODO: Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // TODO: Redraw all lines from the board state
    boardState.forEach((drawData) => {
      drawLine(
        drawData.x0,
        drawData.y0,
        drawData.x1,
        drawData.y1,
        drawData.color,
        drawData.size
      )
    })
  }

  // Helper function to get coordinates from mouse or touch event
  function getCoordinates(e) {
    // TODO: Extract coordinates from the event (for both mouse and touch events)
    if (e.touches) {
      const rectangle = canvas.getBoundingClientRect();
      return {
        // HINT: For touch events, use e.touches[0] or e.changedTouches[0]
        x: e.touches[0].clientX - rectangle.left,
        y: e.touches[0].clientY - rectangle.top
      };
    } else { 
      return {
        // HINT: For mouse events, use e.offsetX and e.offsetY
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  // Handle touch events
  function handleTouchStart(e) {
    // TODO: Prevent default behavior and call startDrawing
    e.preventDefault();
    startDrawing(e);
  }

  function handleTouchMove(e) {
    // TODO: Prevent default behavior and call draw
    e.preventDefault();
    draw(e);
  }
});
