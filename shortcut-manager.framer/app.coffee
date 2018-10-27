{InputLayer} = require "input"

# JSON Definitions
# Unity Command Context JSON
viewportCmds = JSON.parse Utils.domLoadDataSync "json/3dviewport.json"
animationCmds = JSON.parse Utils.domLoadDataSync "json/animation.json"
gridCmds = JSON.parse Utils.domLoadDataSync "json/gridpainting.json"
particleCmds = JSON.parse Utils.domLoadDataSync "json/particlesystem.json"
sceneCmds = JSON.parse Utils.domLoadDataSync "json/sceneview.json"
spriteCmds = JSON.parse Utils.domLoadDataSync "json/spriteeditor.json"
terrainCmds = JSON.parse Utils.domLoadDataSync "json/terrain.json"
timelineCmds = JSON.parse Utils.domLoadDataSync "json/timeline.json"
toolCmds = JSON.parse Utils.domLoadDataSync "json/tools.json"
versionCmds = JSON.parse Utils.domLoadDataSync "json/versioncontrol.json"
contextData = JSON.parse Utils.domLoadDataSync "json/contexts.json"
menuCmds = JSON.parse Utils.domLoadDataSync "json/mainmenu.json"

spacing = 3
commandSpacing = 0
bindingSpacing = 0

# Color Themes
uiTheme = 0

# Personal theme colors
if uiTheme == 0
	backgroundColor = "##D8D8D8"
	boundColor = "#CED8DD"
	unboundColor = "#EDEDED"
	globalColor = "#FFDDD1"
	borderColor = "#BBBBBB"
	modifierColor = "#C7C7C7"
	modifierActiveColor = "#B2D7FF"
	hoverBorderColor = "#75B8FF"
	selectedColor = "#3D80DF"
	textColor = "#000000"
	selectedTextColor = "#FFFFFF"

# Professional theme colors
else
	backgroundColor = "#383838"
	commandBackgroundColor = "#464646"
	boundColor = "#92A3B3"
	unboundColor = "#808080"
	globalColor = "#B39B92"
	borderColor = "#313131"
	modifierColor = "#4A4A4A"
	modifierActiveColor = "#B2D7FF"
	hoverBorderColor = "#75B8FF"
	selectedColor = "#3D80DF"
	textColor = "#D6D6D6"
	selectedTextColor = "#FFFFFF"

# Command Search Field

# Wrap input layer
input = InputLayer.wrap(search, searchText)
input.fontSize = 11
input.borderRadius = 4

# Define the microinteractions for the command search field
input.onInputFocus ->
	this.borderColor = selectedColor
	this.borderWidth = 2
	this.borderRadius = 4
	
input.onInputBlur ->
	this.borderColor = borderColor
	this.borderWidth = 1
	this.borderRadius = 4

# Set the states for when to show/hide the cancel search affordance
cancelSearch.states.add
	default:
		opacity: 0
	enabled:
		opacity: 1

# Show the cancel icon on value change
input.onValueChange ->
	if input.value.length > 0
		cancelSearch.stateSwitch("enabled")
	else
		cancelSearch.stateSwitch("default")

cancelSearch.on Events.MouseDown, (event, layer) ->
	input.value = null
	cancelSearch.stateSwitch("default")

#Contexts
# Use desktop cursor
document.body.style.cursor = "auto"

# Scroll Behaviour for Contexts
scrollContexts = new ScrollComponent
	parent: shortcutContexts
	width: 162
	height: shortcutContexts.height
	scrollHorizontal: false
	mouseWheelEnabled: true

scrollContexts.content.backgroundColor = "transparent"

for data in contextData
	# Create text layer
	text = new TextLayer
		name: data.name
		text: data.name
		width: scrollContexts.width
		height: 16
		fontSize: 11
		color: "#000000"
		parent: scrollContexts.content
		y: spacing
		textIndent: 10

	text.expanded = false
	text.style.cursor = "default"
	text.states.add
		default:
			backgroundColor: "transparent"
			color: "#000000"
		active:
			backgroundColor: "#3C99FC"
			color: "#FFFFFF"

		text.style.cursor = "default"

	text.on Events.MouseDown, (event, text) ->
		currentState = this.states.current.name
		for text in scrollContexts.content.subLayers
			text.stateSwitch("default")
		if currentState != "active"
			this.stateSwitch("active")
			commandList(this)
		else
			this.stateSwitch("default")
	spacing = spacing + 16

# Define the scrollbar element for the scrollable area in the context list.
scrollbar.parent = scrollContexts
scrollbar.height = (scrollContexts.height / scrollContexts.content.height) * scrollContexts.height / 2
margin = scrollbar.y
		
scrollContexts.onScroll ->
	height = scrollContexts.content.height - scrollContexts.height
	percentage = scrollContexts.scrollY	 / height
	freeSpace = scrollContexts.height - scrollbar.height * margin
	scrollbar.y = freeSpace	* percentage + margin

scrollContexts.onScrollStart ->
	scrollbar.animate
		opacity: 100

scrollContexts.onScrollEnd ->
	scrollbar.animate
		opacity: 0

# Scroll Behaviour for Commands
scrollCommands = new ScrollComponent
	parent: scrollList
	width: scrollList.width
	scrollHorizontal: false
	mouseWheelEnabled: true
	
scrollCommands.content.backgroundColor = "transparent"

# Define the scrollbar element for the scrollable area in the context list.
cmdScrollbar.parent = scrollCommands
cmdScrollbar.height = (scrollCommands.height / scrollCommands.content.height) * scrollCommands.height / 2
margin = scrollbar.y
		
scrollCommands.onScroll ->
	height = scrollCommands.content.height - scrollCommands	.height
	percentage = scrollCommands	.scrollY / height
	freeSpace = scrollCommands.height - cmdScrollbar.height * margin
	cmdScrollbar.y = freeSpace	* percentage + margin

scrollCommands.onScrollStart ->
	cmdScrollbar.animate
		opacity: 100

scrollCommands.onScrollEnd ->
	cmdScrollbar.animate
		opacity: 0

# Modifier Keys Setup
for mod in modifiers.subLayers
	for layer in mod.subLayers
		layer.states.add
			default:
				backgroundColor: modifierColor
				borderColor: borderColor
			active:
				backgroundColor: modifierActiveColor
				borderColor: borderColor
			
		layer.on Events.MouseDown, (event, layer) ->
			currentState = this.states.current.name
			parent = layer.parent
			for child in parent.subLayers
				if currentState != "active"
					child.stateSwitch("active")
				else
					child.stateSwitch("default")

# Virtual Keyboard Setup
for keys in bindableKeys.subLayers

	# Add the default, hover, and selected states
	keys.states.add
		default:
			backgroundColor: unboundColor
			borderColor: borderColor
			borderWidth: 1
		hover:
			borderColor: hoverBorderColor
			borderWidth: 1
		selected:
			borderColor: selectedColor
			borderWidth: 2
		bound:
			backgroundColor: boundColor
			borderColor: borderColor
			borderWidth: 1
		global:
			backgroundColor: globalColor
			borderColor: borderColor
			borderWidth: 1

# Keyboard Modifier Setup
# Create a document event listener for keydown events to trigger modifier states
document.addEventListener "keydown", (event) ->
	keyCode = event.which
	if keyCode is 16
		for key in bindableKeys.subLayers
			key.stateSwitch("default")
		leftshift.stateSwitch("active")
		rightshift.stateSwitch("active")
			
		leftBracket.stateSwitch("bound")
		rightBracket.stateSwitch("bound")
		period.stateSwitch("bound")
		comma.stateSwitch("bound")
		f.stateSwitch("global")
		spacebar.stateSwitch("global")
	if keyCode is 17
		leftcontrol.stateSwitch("active")
		rightcontrol.stateSwitch("active")
	if keyCode is 18
		leftoption.stateSwitch("active")
		rightoption.stateSwitch("active")
	if keyCode is 93
		leftcommand.stateSwitch("active")
		rightcommand.stateSwitch("active")

# Create a document event listener for keyup events to reset modifier states
document.addEventListener "keyup", (event) ->
	keyCode = event.which
	
	if keyCode is 16
		for key in bindableKeys.subLayers
			key.stateSwitch("default")
			leftshift.stateSwitch("default")
			rightshift.stateSwitch("default")	
		
		two.stateSwitch("bound")
		minus.stateSwitch("bound")
		equals.stateSwitch("bound")
		tab.stateSwitch("bound")
		q.stateSwitch("global")
		w.stateSwitch("global")
		e.stateSwitch("global")
		r.stateSwitch("global")
		t.stateSwitch("global")
		y.stateSwitch("global")
		u.stateSwitch("bound")
		i.stateSwitch("bound")
		leftBracket.stateSwitch("bound")
		rightBracket.stateSwitch("bound")
		a.stateSwitch("bound")
		s.stateSwitch("bound")
		d.stateSwitch("bound")
		e.stateSwitch("global")
		g.stateSwitch("bound")
		j.stateSwitch("bound")
		l.stateSwitch("bound")
		z.stateSwitch("global")
		x.stateSwitch("global")
		c.stateSwitch("bound")
		b.stateSwitch("bound")
		n.stateSwitch("bound")
		m.stateSwitch("bound")
		comma.stateSwitch("bound")
		period.stateSwitch("bound")
		spacebar.stateSwitch("bound")
		
	if keyCode is 17
		leftcontrol.stateSwitch("default")
		rightcontrol.stateSwitch("default")
		
	if keyCode is 18
		leftoption.stateSwitch("default")
		rightoption.stateSwitch("default")
		
	if keyCode is 93
		leftcommand.stateSwitch("default")
		rightcommand.stateSwitch("default")# Create text layer
		
	if keyCode is 17 && keyCode is 16
		for key in bindableKeys.subLayers
			key.stateSwitch("default")
		
		one.stateSwitch("global")
		two.stateSwitch("global")
		three.stateSwitch("global")
		four.stateSwitch("global")
		five.stateSwitch("global")
		six.stateSwitch("global")
		seven.stateSwitch("global")
		eight.stateSwitch("global")
		nine.stateSwitch("global")
		zero.stateSwitch("global")
		p.stateSwitch("global")
		a.stateSwitch("global")
		s.stateSwitch("global")
		f.stateSwitch("global")
		z.stateSwitch("global")
		c.stateSwitch("global")
		b.stateSwitch("global")
		n.stateSwitch("global")

# Context Selection Method
# When a context is selected, we need to fetch its data from the associated json file that contains its bindings and commands.
commandList = (selection) ->
	commandSpacing = 0
	bindingSpacing = 0
	
	for binding in bindings.subLayers
		binding.destroy()
	
	for i in scrollCommands.content.subLayers
		i.destroy()
	
	index = selection.index
	if index == 0
		for command in viewportCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: 395
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 1
		for command in animationCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 2
		for command in gridCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 3
		for command in menuCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 4
		for command in particleCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 5
		for command in sceneCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 6
		for command in spriteCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 7
		for command in terrainCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 8
		for command in timelineCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 9
		for command in toolCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
				
	if index == 10
		for command in versionCmds.commands
			text = new TextLayer
				name: command.command
				text: command.command
				width: scrollCommands.width
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 0
				y: commandSpacing
				commandSpacing = commandSpacing + 16
				
			text = new TextLayer
				name: command.binding
				text: command.binding
				width: 65
				height: 16
				fontSize: 11
				color: "#000000"
				parent: scrollCommands.content
				textIndent: 10
				x: 485
				y: bindingSpacing
				bindingSpacing = bindingSpacing + 16
