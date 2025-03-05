# Dangerfile

# Para cada commit, realizamos las siguientes validaciones:
git.commits.each do |commit|
  message = commit.message
  lines = message.split("\n")

  # 1. El título (primera línea) debe tener máximo 50 caracteres.
  title = lines[0]
  if title.length > 50
    warn("El título del commit excede los 50 caracteres: \"#{title}\"")
  end

  # 2. Debe haber una línea vacía entre el título y la descripción.
  if lines.length > 1 && lines[1].strip != ""
    warn("El commit debe tener una línea vacía entre el título y la descripción en: \"#{title}\"")
  end

  # 3. La descripción (a partir de la tercera línea) debe tener al menos 5 caracteres.
  description = lines[2..-1]&.join("\n")&.strip || ""
  if description.length < 5
    warn("La descripción del commit es muy corta (menos de 5 caracteres) en: \"#{title}\"")
  end

  # 4. Cada línea de la descripción no debe tener más de 72 caracteres.
  lines[2..-1]&.each do |line|
    if line.length > 72
      warn("Una línea de la descripción excede los 72 caracteres: \"#{line}\"")
    end
  end
end
